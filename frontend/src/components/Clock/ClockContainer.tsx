import React, { useState } from 'react';
import { useClient } from '../../util/hooks/useClient';
import Clock from './Clock';
import Settings from '../Settings';

const ClockContainer: React.FC = () => {
    const client = useClient();
    const [timezoneInput, setTimezoneInput] = useState("America/New_York");
    const [timezone, setTimezone] = useState("");
    const [currentTime, setCurrentTime] = useState("");

    const updateTime = async () => {
        const response = await client.getTime({ timezone: timezoneInput });
        setCurrentTime(response.currentTime);
        setTimezone(response.currentZone);
    };

    const handleTimezoneChange = (newTimezone: string) => {
        setTimezoneInput(newTimezone);
    };

    return (
        <>
            <Clock 
                currentTime={currentTime}
                timezone={timezone}
            />
            <Settings 
                timezoneInput={timezoneInput}
                onTimezoneChange={handleTimezoneChange}
                onUpdateTime={updateTime}
            />
        </>
    );
};

export default ClockContainer; 