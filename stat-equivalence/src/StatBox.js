import { useState } from 'react';

export default function StatBox({ statDescription, stat }) {
    const [name, setName] = useState("");

    return (
        <label>{statDescription}:
            <input type="text" value={stat} onChange={(e) => setName(e.target.value)}/>
        </label>
    );
}