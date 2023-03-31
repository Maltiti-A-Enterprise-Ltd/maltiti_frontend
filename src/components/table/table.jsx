import { GoPrimitiveDot } from "react-icons/go"

export const TableHead = (props) => {
    return(
        <thead className="bg-[#F9FAFB] border-b border-gray_200">
            <tr>
            {props.heads.map((head) => (
                <th key={head}
                scope="col"
                className="px-6 py-5 text-xs font-semibold tracking-wider text-left text-gray-700"
                >
                {head}
                </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
                <span className="sr-only"></span>
            </th>
            </tr>
        </thead>
    );
}

export const TableDataImage = (props) => {
    return(
        <td onClick={props.onClick} className="cursor-pointer px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10">
                <img
                    className="w-10 h-10 rounded-full"
                    src="https://avatars0.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4"
                    alt=""
                />
                </div>
                <div className="ml-4">
                <div className="text-sm text-gray-900">{props.name}</div>
                </div>
            </div>
         </td>
    )
}

export const TableData = (props) => {
    return(
        
        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
            {props.name}
        </td>
    );
}

export const TableStatus = (props) => {
    return(
        <td className="px-6 py-4 whitespace-nowrap">
            <span
                className={`inline-flex items-center gap-x-1 px-4 py-2 text-xs leading-5 ${props.status === "Active" ? "text-[#027A48] bg-[#ECFDF3]" : "text-[#B42318] bg-[#FEF3F2]"} rounded-full`}
            >
                <span><GoPrimitiveDot/></span>
                <span>{props.status}</span>
            </span>
        </td>
    )
}