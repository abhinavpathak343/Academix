class PeerService {
    constructor() {
        this.createPeer();
    }

    createPeer() {
        this.peer = new RTCPeerConnection({
            iceServers: [{
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:global.stun.twilio.com:3478',
                ],
            }],
        });

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
}

export default PeerService;