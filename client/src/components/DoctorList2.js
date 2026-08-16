import React from 'react'
const DoctorList2 = ({doctor}) => 
{
    
  return (
    
      <>
    <div className="card m-3">
        <div className='card-header'>
            Dr. {doctor.firstName} {doctor.lastName}  
        </div>
        <div className="card-body">
            <p>
                <b>
                    Specialization
                </b>{doctor.specialization}
            </p>
            <p>
                <b>
                    Experience
                </b>{doctor.experience}
            </p>
            <p>
                <b>
                    Consultation Fees
                </b>{doctor.feesPerConsultation}
            </p>
            <p>
                <b>
                    Timings
                </b>{doctor.timings[0]}-{doctor.timings[1]}
            </p>

        </div>
    </div>
    </>
  
  )
}

export default DoctorList2
