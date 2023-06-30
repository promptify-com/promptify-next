import React from "react";

type Props = {
    opacity: string
}


export const ListIcon: React.FC<Props> = ({ opacity }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity={opacity}>
            <path d="M15 29V27C15 25.9 15.9 25 17 25H31C32.1 25 33 25.9 33 27V29C33 30.1 32.1 31 31 31H17C15.9 31 15 30.1 15 29ZM15 19V21C15 22.1 15.9 23 17 23H31C32.1 23 33 22.1 33 21V19C33 17.9 32.1 17 31 17H17C15.9 17 15 17.9 15 19Z" fill="#3B4050" />
        </g>
    </svg>
)