import React, { useEffect } from 'react';
import { timezoneOptions } from '../util/timezones'

interface SettingsProps {
    timezoneInput?: string;
    onTimezoneChange: (timezone: string) => void;
    onUpdateTime: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    timezoneInput, 
    onTimezoneChange, 
    onUpdateTime 
}) => {
    useEffect(() => {
        onUpdateTime();
    }, [onUpdateTime]);
    
    return (
        <aside id="settings">
            <form>
                <label htmlFor="tz">
                    Set Timezone:
                </label>
                <select 
                    name={timezoneInput} 
                    defaultValue={timezoneInput}
                    id="tz" 
                    onChange={(e) => onTimezoneChange(e.target.value)}
                >
                    {timezoneOptions.map((opt, index) => (
                        <option key={index} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <button type="button" onClick={onUpdateTime}>
                    Get Time
                </button>
            </form>
        </aside>
    );
};

export default Settings; 