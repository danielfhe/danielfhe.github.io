export default function ClassSelector({ optionsList, setSelected }) {
    function onDropdownSelected(e) {
        setSelected(e.target.value);
    }

    let options = optionsList.map(o => <option key={o} value={o}>{o}</option> );

    return(
        <select id="Dropdown-Selector" onChange={onDropdownSelected}>
            {options}
        </select>
    );
};

