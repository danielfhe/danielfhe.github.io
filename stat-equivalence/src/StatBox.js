export default function StatBox({ statName, stat, type, setStatValue }) {
    function onStatChange(e) {
        setStatValue(e.target.value);
    }

    return (
        <label>{statName}
            <input className="Stat-Box" type={type} defaultValue={stat} onChange={onStatChange}/>
        </label>
    );
}