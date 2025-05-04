import React from "react";

interface Props {
    imageUrl: string,
    name: string,
    className: string,
}

const Avatar: React.FC<Props> = ({imageUrl, name, className}) => {
    return (
        <img
                src= {imageUrl}
                alt= {name}
                className= {className + " rounded-full object-cover border-2 border-(--text-color)/5 shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg"}
            />
    )
}

export default Avatar;