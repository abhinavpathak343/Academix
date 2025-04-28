class PeerService {
    constructor() {
        this.createPeer();
        this.pendingCandidates = [];
        this.remoteDescriptionSet = false;
    }

    createPeer() {
        this.peer = new RTCPeerConnection({
            iceServers: [{
                    urls: 'stun:stun.l.google.com:19302'
                },
                {
                    urls: 'turn:global.turn.twilio.com:3478?transport=udp',
                    username: 'YOUR_TWILIO_USERNAME',
                    credential: 'YOUR_TWILIO_CREDENTIAL'
                }
            ]
        });

        this.pendingCandidates = [];
        this.remoteDescriptionSet = false;

        // Handle ICE candidates
        this.peer.onicecandidate = (event) => {
            if (event.candidate) {
                this.onIceCandidate(event.candidate);
            }
        };

        // Handle connection state changes
        this.peer.onconnectionstatechange = () => {
            console.log('Connection state:', this.peer.connectionState);
        };

        // Handle ICE connection state changes
        this.peer.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', this.peer.iceConnectionState);
        };
    }

    isPeerClosed() {
        return (
            this.peer.connectionState === "closed" ||
            this.peer.signalingState === "closed"
        );
    }

    ensurePeerOpen() {
        if (this.isPeerClosed()) {
            this.createPeer();
        }
    }

    async getOffer() {
        this.ensurePeerOpen();
        try {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
            return null;
        }
    }

    async getAnswer(offer) {
        this.ensurePeerOpen();
        try {
            if (!offer || !offer.type || !offer.sdp) {
                throw new Error("Received invalid offer for getAnswer");
            }
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peer.createAnswer();
            await this.peer.setLocalDescription(new RTCSessionDescription(answer));
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
            return null;
        }
    }

    async setRemoteDescription(answer) {
        this.ensurePeerOpen();
        try {
            if (!answer || !answer.type || !answer.sdp) {
                throw new Error("Received invalid answer for setRemoteDescription");
            }
            await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
            this.remoteDescriptionSet = true;
            // Add any pending ICE candidates
            while (this.pendingCandidates.length > 0) {
                const candidate = this.pendingCandidates.shift();
                await this.addIceCandidate(candidate);
            }
        } catch (error) {
            console.error("Error setting remote description:", error);
        }
    }
    async addStream(stream) {
        this.ensurePeerOpen();
        try {
            stream.getTracks().forEach(track => {
                this.peer.addTrack(track, stream);
            });
        } catch (error) {
            console.error("Error adding stream:", error);
        }
    }

    async addIceCandidate(candidate) {
        if (this.isPeerClosed()) {
            console.warn("Peer is closed, ignoring ICE candidate");
            return;
        }
        if (!this.remoteDescriptionSet) {
            // Buffer the candidate until remote description is set
            this.pendingCandidates.push(candidate);
            return;
        }
        try {
            await this.peer.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    }

    onIceCandidate(candidate) {
        // This method will be overridden by the Room component
        console.log('New ICE candidate:', candidate);
    }

    setOnIceCandidate(callback) {
        this.onIceCandidate = callback;
    }

    close() {
        this.peer.close();
        this.createPeer(); // Re-initialize for next call
    }

    setOnTrack(callback) {
        this.peer.ontrack = callback;
    }
}

export default PeerService;