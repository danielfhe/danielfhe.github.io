import { useState } from 'react';

export default function StatBox({ statDescription: statName, stat }) {
    const [name, setName] = useState("");

    return (
        <>
            <label>{statName}</label>
            <input className="Stat-Box" type="number" value={stat} onChange={(e) => setName(e.target.value)}/>
        </>
    );
}