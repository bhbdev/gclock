export class ClockController {
    private intervalMinutes: NodeJS.Timeout | null = null;
    private intervalSeconds: NodeJS.Timeout | null = null;

    setClockHands(timeString: string) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const hands = [
            { hand: 'hours',   angle: (hours%12 * 30) + (minutes / 2) },
            { hand: 'minutes', angle: (minutes * 6) },
            { hand: 'seconds', angle: (seconds * 6) }
        ];
        
        for (let j = 0; j < hands.length; j++) {
            const elems = document.querySelectorAll('.' + hands[j].hand);
            for (let k = 0; k < elems.length; ++k) {
                (elems[k] as HTMLElement).style.webkitTransform = 'rotateZ('+ hands[j].angle +'deg)';
                (elems[k] as HTMLElement).style.transform = 'rotateZ('+ hands[j].angle +'deg)';
                if (hands[j].hand === 'minutes') {
                    if (elems[k].parentNode) {
                        (elems[k].parentNode as HTMLElement).setAttribute('data-second-angle', hands[j + 1].angle.toString());
                    }
                }
            }
        }
    }

    setUpMinuteHands() {
        const containers = document.querySelectorAll('.minutes-container');
        const secondAngle = Number(containers[0].getAttribute("data-second-angle"));
        if (secondAngle > 0) {
            const delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
            setTimeout(() => {
                this.moveMinuteHands(containers);
            }, delay);
        }
    }

    private moveMinuteHands(containers: NodeListOf<Element>) {
        for (let i = 0; i < containers.length; i++) {
            (containers[i] as HTMLElement).style.webkitTransform = 'rotateZ(6deg)';
            (containers[i] as HTMLElement).style.transform = 'rotateZ(6deg)';
        }
        
        this.intervalMinutes = setInterval(() => {
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i] as HTMLElement;
                let angle = parseFloat(container.getAttribute('data-angle') || '0');
                angle = (angle + 6) % 360;
                container.setAttribute('data-angle', angle.toString());
                container.style.webkitTransform = 'rotateZ(' + angle + 'deg)';
                container.style.transform = 'rotateZ(' + angle + 'deg)';
            }
        }, 60000);
    }

    moveSecondHands(updateTimeCallback: () => void) {
        const containers = document.querySelectorAll('.seconds-container');
        for (let i = 0; i < containers.length; i++) {
            const container = containers[i] as HTMLElement & { angle?: number };
            container.angle = 0;
            container.style.webkitTransform = 'rotateZ(0deg)';
            container.style.transform = 'rotateZ(0deg)';
        }
        
        this.intervalSeconds = setInterval(() => {
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i] as HTMLElement & { angle?: number };
                if (container.angle === undefined) {
                    container.angle = 6;
                } else {
                    container.angle += 6;
                }
                container.style.webkitTransform = 'rotateZ('+ container.angle +'deg)';
                container.style.transform = 'rotateZ('+ container.angle +'deg)';
            }
            updateTimeCallback();
        }, 1000);
    }

    cleanup() {
        if (this.intervalMinutes) {
            clearInterval(this.intervalMinutes);
        }
        if (this.intervalSeconds) {
            clearInterval(this.intervalSeconds);
        }
    }
} 