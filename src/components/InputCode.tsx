import { useRef } from "react";

interface Props {
    value: string[];
    onChange: (value: string[]) => void;
};

const InputCode = ({ value, onChange }: Props) => {
    const refs = useRef<HTMLInputElement[]>([]);

    const handleChange = (i: number, val: string) => {
        const newVal = [...value];
        newVal[i] = val.slice(-1);
        onChange(newVal);
        if (val && i < 3) {
            refs.current[i + 1]?.focus();
        }
    };

    return (
        <div className="flex justify-between gap-3">
            {value.map((val, i) => (
                <input
                    key={i}
                    ref={el => {
                        refs.current[i] = el!;
                    }}
                    value={val}
                    onChange={e => handleChange(i, e.target.value)}
                    maxLength={1}
                    className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl focus:ring-2 focus:ring-blue-400"
                />
            ))
            }
        </div>
    );
};

export default InputCode;