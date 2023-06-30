import React from "react";

type Props = {
    opacity: string
}

export const CardIcon: React.FC<Props> = ({ opacity }) => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity={opacity}>
            <path d="M26.67 17V23.5H21.33V17H26.67ZM27.67 23.5H33V17H27.67V23.5ZM26.67 31V24.5H21.33V31H26.67ZM27.67 24.5V31H33V24.5H27.67ZM20.33 24.5H15V31H20.33V24.5ZM20.33 23.5V17H15V23.5H20.33Z" fill="#3B4050" />
        </g>
    </svg>
)
