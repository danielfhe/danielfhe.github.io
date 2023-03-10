export default function ClassSelector({ classes, selectedClass }) {
    function onDropdownSelected(e) {
        console.log("Class dropdown selected value: ", e.target.value);
        selectedClass = e.target.value;
    }

    let options = classes.map(c => <option key={c} value={c}>{c}</option> );

    return(
        <select id="Class-Selector" onChange={onDropdownSelected}>
            {options}
        </select>
    );
};

