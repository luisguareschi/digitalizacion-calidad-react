import {Button} from "react-bootstrap";
import { components } from "react-select";
import Select from 'react-select'
import {useEffect, useState} from "react";

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};


const FilterRecordDropdown = (props) => {
    const [values, setValues] =  useState([])

    // organize values
    useEffect( () => {
        let vals = Array.from(new Set(props.columnValues))
        let v = vals.map(val => {
            return {value: val, label: val}
        })
        setValues(v)
    }, [props.columnValues])

    const handleChange = (selected) => {
        selected = selected.map(dict => dict.value)
        props.changeFiltersTable(props.columnName, selected)
    }

    return (
        <div>
            <Select
                isMulti
                options={values}
                placeholder={"Filter..."}
                components={{Option}}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                allowSelectAll={false}
                className={'column-filter'}
                onChange={handleChange}
                controlShouldRenderValue={false}
                // menuIsOpen={true}
            />
        </div>
    )
}

export default FilterRecordDropdown