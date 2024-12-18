import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const TransactionCard = (prompt) => {

    const navigate = useNavigate();

    const transfer = prompt.transfer
    const user = prompt.user

    const convertToIndianTime = (isoTimestamp) => {
        const date = new Date(isoTimestamp);
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };
        const indianTime = new Intl.DateTimeFormat('en-IN', options).format(date);
        return indianTime;
    }

    const add = ((transfer.transactionType === "ADD") || ((transfer.transactionType === "TRANSFER") && (transfer?.to?._id === user?._id)))

    return (
        <div
            key={transfer.id}
            className="items-center bg-blue-50 p-3 rounded-lg border-2 hover:bg-white"
        >
            <div className='flex justify-between'>
                <div>
                    <p className="flex text-blue-900">{transfer.transactionType}
                        {
                            (add) ?
                                <GoArrowDownLeft className='text-lg pt-1 text-green-500' /> : <GoArrowUpRight className='text-lg pt-1 text-red-500' />
                        }
                    </p>
                    <p className="text-sm text-gray-600">{convertToIndianTime(transfer.createdAt)}</p>
                </div>
                <span className={`font-bold ${add ? 'text-green-600' : 'text-red-600'}`}>
                    {add ? '+' : ''} R{Math.abs(transfer.amount).toFixed(2)}
                </span>
            </div>
            {
                (transfer.transactionType === "TRANSFER") && (
                    <div className='text-lg flex justify-center border-t mt-2'>
                        <div className='flex justify-between pt-2'>
                            <p className="text-gray-600 cursor-pointer" onClick={(add) && (() => navigate(`/transfer?to=${transfer?.from?.paymentId}`))}><span className='font-semibold text-red-600'>{transfer?.from?.name}</span> ({transfer?.from?.paymentId})</p>
                            <FaLongArrowAltRight className='mx-4 mt-1.5' />
                            <p className="font-medium text-blue-900 cursor-pointer" onClick={(!add) && (() => navigate(`/transfer?to=${transfer?.to?.paymentId}`))}><span className='font-semibold text-green-600'>{transfer?.to?.name}</span> ({transfer?.to?.paymentId})</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default TransactionCard;
