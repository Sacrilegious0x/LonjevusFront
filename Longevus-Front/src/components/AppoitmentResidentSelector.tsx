

export const RESIDENTS: Resident[] = [
    { value: "apt101", label: "Apt 101 - María García" },
    { value: "apt102", label: "Apt 102 - Juan Pérez" },
    { value: "apt103", label: "Apt 103 - Ana Rodríguez" },
    { value: "apt201", label: "Apt 201 - Carlos López" },
    { value: "apt202", label: "Apt 202 - Laura Martínez" },
    { value: "apt203", label: "Apt 203 - Pedro Sánchez" },
    { value: "apt301", label: "Apt 301 - Isabel Fernández" },
    { value: "apt302", label: "Apt 302 - Miguel Torres" },
    { value: "apt303", label: "Apt 303 - Carmen Ruiz" },
    { value: "apt401", label: "Apt 401 - Roberto Jiménez" },
]

export interface Resident {
    value: string
    label: string
}

interface ResidentSelectorProps {
  selectedResident: string
  onResidentChange: (resident: string) => void
}

const ResidentSelector = ({ selectedResident, onResidentChange }: ResidentSelectorProps) =>{
  return (
    <>
    <div className="card shadow-sm border-dark-subtle">
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">
          <i className="bi bi-person-fill me-2"></i>
          Seleccionar Residente
        </h5>
      </div>
      <div className="card-body">
        <select
          className="form-select form-select"
          value={selectedResident}
          onChange={(e) => onResidentChange(e.target.value)}
          required
        >
          <option value="">Selecciona un residente...</option>
          {RESIDENTS.map((resident) => (
            <option key={resident.value} value={resident.value}>
              {resident.label}
            </option>
          ))}
        </select>
      </div>
    </div>
    </>
  )
}
export default ResidentSelector;