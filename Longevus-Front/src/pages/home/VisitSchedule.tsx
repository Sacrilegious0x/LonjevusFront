import { useState } from "react"
import type { FormData } from "../../components/VisitorForms"
import ResidentSelector from "../../components/AppoitmentResidentSelector"
import TimeSelector from "../../components/AppoitmentTimeSelector"
import VisitorForm from "../../components/VisitorForms"
import AppointmentSummary from "../../components/AppointmentSummaryCard"
import ConfirmationScreen from "../../components/AppoitmentConfirmationCard"
import DateSelector from "../../components/AppoitmentDateSelector"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
const AppointmentScheduler = () => {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [formData, setFormData] = useState<FormData>({
    resident: "",
    name: "",
    email: "",
    phone: "",
    relationship: "",
    notes: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (isFormValid) {
      setIsSubmitted(true)
    }
  }

  const handleNewAppointment = () => {
    setIsSubmitted(false)
    setSelectedDate("")
    setSelectedTime("")
    setFormData({
      resident: "",
      name: "",
      email: "",
      phone: "",
      relationship: "",
      notes: "",
    })
  }

  const isFormValid =
    selectedDate && selectedTime && formData.resident && formData.name && formData.email && formData.relationship

  if (isSubmitted) {
    return (
      <ConfirmationScreen
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        formData={formData}
        onNewAppointment={handleNewAppointment}
      />
    )
  }

  return (
    <>
    <Header/>
      <div className="min-vh-100" style={{ background: "#ffffff" }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-3">Agendar Visita</h1>
            <p className="lead text-muted">Selecciona el residente, fecha y hora que mejor te convenga</p>
          </div>

          <div className="row g-4">
            {/* Resident Selection */}
            <div className="col-12">
              <ResidentSelector
                selectedResident={formData.resident}
                onResidentChange={(value) => handleInputChange("resident", value)}
              />
            </div>

            {/* Date and Time Selection */}
            <div className="col-lg-12">
              <DateSelector selectedResident={formData.resident} selectedDate={ selectedDate} onDateChange={setSelectedDate} />
            </div>

            <div className="col-lg-12">
              <TimeSelector selectedTime={selectedTime} selectedDate={selectedDate} onTimeChange={setSelectedTime} />
            </div>

            {/* Visitor Information */}
            <div className="col-12">
              <VisitorForm formData={formData} onInputChange={handleInputChange} />
            </div>

            {/* Summary and Submit */}
            <div className="col-12">
              <AppointmentSummary
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                formData={formData}
                onSubmit={handleSubmit}
                isFormValid={!!isFormValid}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
export default AppointmentScheduler;