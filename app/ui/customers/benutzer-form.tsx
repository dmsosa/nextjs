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


    return (
        <form method="post" action={"#"}>

        </form>
    )
}

