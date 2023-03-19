// export const Select = (props) => {
//     return(
//         <div className="inline-flex outline-none rounded-md mb-3 border border-gray_300 px-2">
//             <select 
//                 id="specialization" 
//                 className="rounded-lg block w-full py-3 px-6"
//                 onChange={(event)=> props.setService(event.target.value)}
//                 value={props.service} 
//             >
//                 {isLoading ? 
//                 <option value="" disabled>Loading... Please Wait</option>
//                 :
//                 <>
//                 <option value="" disabled>Select speciality</option>
//                 <option value="">All</option>
//                 {speciality.map((speciality, key) => (
//                 <option key={speciality.id} value={speciality.speciality}>{speciality.speciality}</option>
//                 ))}
//                 </>
//                 }
//             </select>
//         </div>
//     );
// }
