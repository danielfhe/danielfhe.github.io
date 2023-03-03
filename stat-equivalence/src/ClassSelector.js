export default function ClassSelector({ classes, selectedClass }) {
    function onDropdownSelected(e) {
        console.log("Class dropdown selected value: ", e.target.value);
        selectedClass = e.target.value;
    }

    let options = classes.map(c => <option value={c}>{c}</option> );

    return(
        <select class="form-control" name="class" id="class" onChange={onDropdownSelected}>
            {options}
        </select>
    );
};

