import React, { useState, useRef, useEffect } from 'react';
import timezones from 'timezones-list';
import { useClient } from '../util/hooks/useClient';
import { parallax } from '../util/parallax';


const Clock: React.FC = () => {
    const client = useClient();  
    const [timezoneInput, setTimezoneInput] = useState("");
    const [timezone, setTimezone] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const intervalMinutes = useRef<NodeJS.Timeout | null>(null);
    const intervalSeconds = useRef<NodeJS.Timeout | null>(null);

    const setClockHands = (timeString: string) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const hands = [
          { hand: 'hours',   angle: (hours%12 * 30) + (minutes / 2) },
          { hand: 'minutes', angle: (minutes * 6) },
          { hand: 'seconds', angle: (seconds * 6) }
        ];
        // Loop through each of these hands to set their angle
        for (let j = 0; j < hands.length; j++) {
          const elems = document.querySelectorAll('.' + hands[j].hand);
          for (let k = 0; k < elems.length; ++k) {
              (elems[k] as HTMLElement).style.webkitTransform = 'rotateZ('+ hands[j].angle +'deg)';
              (elems[k] as HTMLElement).style.transform = 'rotateZ('+ hands[j].angle +'deg)';
              // If this is a minute hand, note the seconds position (to calculate minute position later)
              if (hands[j].hand === 'minutes') {
                if (elems[k].parentNode) {
                  (elems[k].parentNode as HTMLElement).setAttribute('data-second-angle', hands[j + 1].angle.toString());
                }
              }
          }
        } 
    };

    function setUpMinuteHands() {
        // Find out how far into the minute we are
        const containers = document.querySelectorAll('.minutes-container');
        const secondAngle = Number(containers[0].getAttribute("data-second-angle"));
        if (secondAngle > 0) {
          // Set a timeout until the end of the current minute, to move the hand
          const delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
          setTimeout(function() {
            moveMinuteHands(containers);
          }, delay);
        }
    }

    function moveMinuteHands(containers:NodeListOf<Element>) {
        for (let i = 0; i < containers.length; i++) {
          (containers[i] as HTMLElement).style.webkitTransform = 'rotateZ(6deg)';
          (containers[i] as HTMLElement).style.transform = 'rotateZ(6deg)';
        }
        // Then continue with a 60 second interval
        intervalMinutes.current = setInterval(function() {
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

    function moveSecondHands() {
        const containers = document.querySelectorAll('.seconds-container');
        // Reset the angle of the second hands
        for (let i = 0; i < containers.length; i++) {
          const container = containers[i] as HTMLElement & { angle?: number };
          container.angle = 0;
          container.style.webkitTransform = 'rotateZ(0deg)';
          container.style.transform = 'rotateZ(0deg)';
        }
        intervalSeconds.current = setInterval(function() {
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
          // make currentTime counter increment to match the clock
          updateCurrentTime();
        }, 1000);
    };

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

    
    const updateTime = async () => {
        
        const response = await client.getTime({ timezone: timezoneInput });
        setCurrentTime(response.currentTime);
        setTimezone(response.currentZone);
        
    
        // Clear any existing intervals
        if (intervalMinutes.current) {
          clearInterval(intervalMinutes.current);
          
        }
        if (intervalSeconds.current) {
          clearInterval(intervalSeconds.current);
        }
        setClockHands(response.currentTime);
        setUpMinuteHands();
        moveSecondHands();
    };
    
    
      
    useEffect(() => { parallax('.App', '#gclock', 200) }, []);

    useEffect(() => {
        updateTime();
        return () => {
            if (intervalMinutes.current) {
            clearInterval(intervalMinutes.current);
            }
            if (intervalSeconds.current) {
            clearInterval(intervalSeconds.current);
            }
        };
    }, []); // Empty dependency array ensures the effect runs only once
    
    

    return (
        <>
            <div id="gclock">
                <article className="clock simple">
                    <div className="clock__logo">gClock</div>
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
            <form>
                <label htmlFor="tz">
                    Set Timezone:
                </label>
                <select name={timezoneInput} id="tz" onChange={(e) => setTimezoneInput(e.target.value)}>
                    {timezones
                    .filter(tz => /[a-zA-Z]/.test(tz.name))
                    .sort((a, b) => a.tzCode.localeCompare(b.tzCode))
                    .map((tz, index) => (
                        <option key={index} value={tz.tzCode}>
                        {tz.label}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={() => updateTime()}>
                    Get Time
                </button>
            </form>
    </> 
    );
};

export default Clock;