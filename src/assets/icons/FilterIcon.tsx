import React from "react";


type Props = {
    asc: boolean
}
export const FilterIcon: React.FC<Props> = ({ asc }) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.6667 7.00004L12.4917 5.82504L7.83334 10.475V0.333374H6.16668V10.475L1.51668 5.81671L0.333344 7.00004L7.00001 13.6667L13.6667 7.00004Z" fill="#3B4050" transform={asc ? "rotate(180 7 7)" : ""} />
    </svg>

)
