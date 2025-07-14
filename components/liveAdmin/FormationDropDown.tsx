import { ChevronDown } from "lucide-react";

const formations = [
    { name: "4-4-2", value: "442" },
    { name: "4-3-3", value: "433" },
    { name: "4-2-3-1", value: "4231" },
    { name: "3-5-2", value: "352" },
    { name: "5-3-2", value: "532" },
    { name: "3-4-3", value: "343" }
]

const FormationDropdown = (
    { team, value, isOpen, setIsOpen, handleFormationChange }: 
    { team: 'homePlayers' | 'awayPlayers', value: string, isOpen: boolean, setIsOpen: ( team: 'homeTeam' | 'awayTeam' ) => void, handleFormationChange: ( team: "homeTeam" | "awayTeam", formationValue: string ) => void }
  ) => {
    const currentFormation = formations.find(f => f.value === value)?.name || "Select Formation";
    
    return (
      <div className="relative">
        <button
          className="flex items-center justify-between w-full px-3 py-2 text-sm bg-card rounded-md border border-border"
          onClick={ () => setIsOpen( team === 'homePlayers' ? 'homeTeam' : 'awayTeam' ) }
        >
          <span>{ currentFormation }</span>
          <ChevronDown size={ 16 } className={ `transition-transform ${ isOpen ? 'rotate-180' : '' }` } />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-card rounded-md border border-border shadow-lg">
            <ul className="py-1">
              {formations.map(( formation ) => (
                <li 
                  key={formation.value}
                  className="px-3 py-2 text-sm hover:bg-emerald-500 hover:text-white cursor-pointer transition-colors"
                  onClick={
                    () => handleFormationChange( 
                      team === 'homePlayers' ? 'homeTeam' : 'awayTeam',
                      formation.value
                    )
                  }
                >
                  {formation.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
};

export default FormationDropdown;