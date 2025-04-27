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

    ensurePeerOpen() {
        if (this.peer.connectionState === "closed" || this.peer.signalingState === "closed") {
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
            if (!offer) {
                throw new Error("Received null offer");
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
            if (!answer) {
                throw new Error("Received null answer");
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

// Create a single instance
const peerService = new PeerService();
export default peerService;