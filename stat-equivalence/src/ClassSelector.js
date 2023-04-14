export default function ClassSelector({ classes, setSelectedClass }) {
    function onDropdownSelected(e) {
        setSelectedClass(e.target.value);
    }

    let options = classes.map(c => <option key={c} value={c}>{c}</option> );

    return(
        <select id="Class-Selector" onChange={onDropdownSelected}>
            {options}
        </select>
    );
};

