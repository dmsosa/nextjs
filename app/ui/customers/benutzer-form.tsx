'use client'

import { ChangeEvent, MouseEvent, useState } from "react";

type TBenutzerForm = {
    name: string, 
    email: string, 
    imageURL: string,
}
const initForm = {
    name: "",
    email: "",
    imageURL: ""
}

export function BenutzerErstellenForm() {
    const [ form, setForm ] = useState<TBenutzerForm>(initForm);
    const fields: { [key:string] : string} = { "name":"text", "email":"email", "image url": "text"};

    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name;
        const val = e.target.value;
        setForm((prev) => ({ ...prev, [field]: val }));
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
    }

    return (
        <form method="post" action={"#"}>
            {Object.keys(fields).map((field) => {
                let inputName;
                if (field === 'image url') {
                    inputName = 'imageURL'
                } else (inputName = field);
                let inputValue;
                switch (field) {
                    case 'name': {inputValue = form.name; break};
                    case 'email': {inputValue = form.email; break};
                    case 'image url': {inputValue = form.imageURL; break};
                    default : break
                }
            return (
                <fieldset>
                    <label>{field}</label>
                    <input 
                    type={fields[field]} 
                    placeholder={`Enter your ${field}`} 
                    name={inputName} 
                    value={inputValue}
                    onChange={handleChange}></input>
                </fieldset>
            )})}
            <button type="submit" onClick={handleSubmit}>Benutzer erstellen</button>
        </form>
    )
}

