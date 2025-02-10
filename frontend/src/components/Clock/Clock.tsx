import React, { useRef, useEffect } from 'react';
import { parallax } from '../../util/parallax';
import { ClockController } from './ClockController';

interface ClockProps {
    currentTime: string;
    timezone: string;
}

const Clock: React.FC<ClockProps> = ({ currentTime, timezone }) => {
    const clockController = useRef<ClockController>(new ClockController());
    const isAM = currentTime ? parseInt(currentTime.split(':')[0]) < 12 : false;

    const updateCurrentTime = () => {
        const currentTime = document.querySelector('.clock__time') as HTMLElement;
        const time = currentTime.innerText.split(':');
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        let seconds = parseInt(time[2]);
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        if (hours === 24) {
            hours = 0;
        }
        currentTime.innerText = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    useEffect(() => { parallax('.main', '#gclock', 200) }, []);

    useEffect(() => {
        if (!currentTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            


            const timeElement = document.querySelector('.clock__time') as HTMLElement;
            if (timeElement) {
                timeElement.innerText = timeString;
                clockController.current.setClockHands(timeString);
                clockController.current.setUpMinuteHands();
                clockController.current.moveSecondHands(updateCurrentTime);
            }
        }
    }, []);

    useEffect(() => {
        if (currentTime) {
            clockController.current.cleanup();
            clockController.current.setClockHands(currentTime);
            clockController.current.setUpMinuteHands();
            clockController.current.moveSecondHands(updateCurrentTime);
        }

        return () => {
            clockController.current.cleanup();
        };
    }, [currentTime]);

    return (
        <div id="gclock">
            <article className={`clock simple ${isAM ? 'am' : ''}`}>
                <div className="clock__logo">gClock {isAM? '☼':'☾'}</div>
                <div className="hours-container">
                    <div className="hours"></div>
                </div>
                <div className="minutes-container">
                    <div className="minutes"></div>
                </div>
                <div className="seconds-container">
                    <div className="seconds"></div>
                </div>
                <div className="clock__time">{currentTime}</div>
                <div className="clock__ampm">{currentTime && (parseInt(currentTime.split(':')[0]) >= 12 ? 'PM' : 'AM')}</div>
                <div className="clock__zone">{timezone}</div>
                <div className="clock__face"></div>
            </article>
        </div>
    );
};

export default Clock;