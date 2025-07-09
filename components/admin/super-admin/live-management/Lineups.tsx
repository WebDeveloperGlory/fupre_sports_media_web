import React, { useState } from 'react'
import { LiveFixSubCreate } from '@/utils/V2Utils/formData'
import { TeamType } from '@/utils/V2Utils/v2requestData.enums'
import { FixtureLineup, FixtureSubstitutions } from '@/utils/V2Utils/v2requestSubData.types';
import { ArrowDown, ArrowUp, ArrowUpCircle, ArrowUpDown, LayoutGrid, Plus, Trash2, Users } from 'lucide-react'

const Lineups = (
    { homeName, awayName, homeLineup, awayLineup, currentMinute, substitutions, saveSubs }:
    { 
        homeName: string, awayName: string, 
        homeLineup: FixtureLineup, awayLineup: FixtureLineup , 
        currentMinute: number, 
        substitutions: FixtureSubstitutions[], 
        saveSubs: ( sub: LiveFixSubCreate ) => void 
    }
) => {
    const [subData, setSubData] = useState<LiveFixSubCreate>({
        team: '' as TeamType,
        playerOutId: '',
        playerInId: '',
        minute: currentMinute,
        injury: false,
    });

    const handleSub = () => {
        saveSubs( subData );
    }
    const isSubOut = ( playerId: string ) => substitutions.some( sub => sub.playerOut._id === playerId );
    const isSubIn = ( playerId: string ) => substitutions.some( sub => sub.playerIn._id === playerId );
    const disableCreateSub = subData.playerOutId === '' || subData.playerInId === ''
  return (
    <>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
            <div className='md:col-span-2 px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                {/* Title */}
                <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                    <Users className='w-5 h-5' />
                    Make Substitution
                </h2>

                {/* Form body */}
                <div className='space-y-4 mt-4'>
                    {/* Team */}
                    <div>
                        <label className="block font-semibold mb-1.5">Select Team</label>
                        <select 
                            className="w-full p-2 border rounded cursor-pointer bg-input"
                            value={ subData.team }
                            onChange={ (e) => setSubData({ 
                                ...subData, 
                                team: e.target.value as TeamType,
                                playerOutId: '',
                                playerInId: ''
                            }) }
                        >
                            <option value={''} className='flex flex-col'>
                                Select Team
                            </option>
                            {
                                Object.values( TeamType ).map( team => (
                                    <option key={ team } value={ team } className='flex flex-col'>
                                        { team }
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Minute */}
                    <div>
                        <label className="block font-semibold mb-1.5">Minute</label>
                        <input
                            type='number'
                            placeholder='0'
                            value={ subData.minute }
                            onChange={
                            ( e ) => setSubData({
                                ...subData,
                                minute: Number(e.target.value)
                            })
                        }
                        className='w-full p-2 border rounded bg-input'
                        />
                    </div>

                    {/* Player Out */}
                    {
                        subData.team === TeamType.HOME ? (
                            <div>
                                <label className="block font-semibold mb-1.5">Player Out</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ subData.playerOutId }
                                    onChange={ (e) => setSubData({ 
                                        ...subData, 
                                        playerOutId: e.target.value
                                    }) }
                                >
                                    <option value={''} className='flex flex-col'>
                                        Select Player
                                    </option>
                                    {
                                        [ ...homeLineup.startingXI.filter( player => !isSubOut( player.player._id ) ) ].map( player => (
                                            <option 
                                                key={ player.player._id } 
                                                value={ player.player._id } 
                                                className='flex flex-col'
                                            >
                                                { player.player.name }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        ) : subData.team === TeamType.AWAY && (
                            <div>
                                <label className="block font-semibold mb-1.5">Player Out</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ subData.playerOutId }
                                    onChange={ (e) => setSubData({ 
                                        ...subData, 
                                        playerOutId: e.target.value
                                    }) }
                                >
                                    <option value={''} className='flex flex-col'>
                                        Select Player
                                    </option>
                                    {
                                        [ ...awayLineup.startingXI.filter( player => !isSubOut( player.player._id ) ) ].map( player => (
                                            <option 
                                                key={ player.player._id } 
                                                value={ player.player._id } 
                                                className='flex flex-col'
                                            >
                                                { player.player.name }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )
                    }

                    {/* Player In */}
                    {
                        subData.team === TeamType.HOME ? (
                            <div>
                                <label className="block font-semibold mb-1.5">Player In</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ subData.playerInId }
                                    onChange={ (e) => setSubData({ 
                                        ...subData, 
                                        playerInId: e.target.value
                                    }) }
                                >
                                    <option value={''} className='flex flex-col'>
                                        Select Player
                                    </option>
                                    {
                                        [ ...homeLineup.substitutes.filter( sub => !isSubIn( sub.player._id )) ].map( player => (
                                            <option 
                                                key={ player.player._id } 
                                                value={ player.player._id } 
                                                className='flex flex-col'
                                            >
                                                { player.player.name }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        ) : subData.team === TeamType.AWAY && (
                            <div>
                                <label className="block font-semibold mb-1.5">Player In</label>
                                <select 
                                    className="w-full p-2 border rounded cursor-pointer bg-input"
                                    value={ subData.playerInId }
                                    onChange={ (e) => setSubData({ 
                                        ...subData, 
                                        playerInId: e.target.value
                                    }) }
                                >
                                    <option value={''} className='flex flex-col'>
                                        Select Player
                                    </option>
                                    {
                                        [ ...awayLineup.substitutes.filter( sub => !isSubIn( sub.player._id )) ].map( player => (
                                            <option 
                                                key={ player.player._id } 
                                                value={ player.player._id } 
                                                className='flex flex-col'
                                            >
                                                { player.player.name }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )
                    }

                    {/* Injury Selector */}
                    <div
                        onClick={
                            () => setSubData({
                                ...subData,
                                injury: !subData.injury
                            }) 
                        }
                        className='flex gap-2 items-center cursor-pointer w-fit'
                    >
                        <div
                            className={`
                                w-4 h-4 rounded-sm ${
                                    subData.injury
                                    ? 'bg-emerald-500'
                                    : 'bg-white'
                            }
                            `}
                        ></div>
                        <p className={`${ subData.injury ? 'text-green-500' : '' }`}>Injury Substitution?</p>
                    </div>
                    
                    {/* Button */}
                    <button
                        onClick={ handleSub }
                        className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 rounded-lg flex items-center gap-2 justify-center disabled:opacity-50 disabled:line-through'
                        disabled={ disableCreateSub }
                    >
                        <Plus className='w-5 h-5' />
                        Make Substitution
                    </button>
                </div>
            </div>
            <div className='md:col-span-4 px-4 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
                {/* Title */}
                <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                    <LayoutGrid className='w-5 h-5' />
                    Current Lineup
                </h2>

                {/* Lineups */}
                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Home */}
                    <div className='space-y-2'>
                        {/* Top Section */}
                        <div className='flex gap-2 items-center'>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full border border-muted-foreground text-muted-foreground'>H</div>
                            <div>
                                <p>{ homeName }</p>
                                <span className='text-muted-foreground text-sm'>Formation: { homeLineup.formation }</span>
                            </div>
                        </div>

                        {/* Starting 11 */}
                        <div>
                            <p className='text-sm'>Starting XI</p>
                            <div className='mt-2 space-y-2'>
                                {
                                    homeLineup.startingXI.map((player, i) => (
                                        <div 
                                            key={ player.player._id }
                                            className={`
                                                px-3 py-2 border rounded-lg flex items-center gap-2 ${
                                                    isSubOut( player.player._id ) 
                                                        ? 'border-red-500 bg-red-500/10'
                                                        : 'border-muted-foreground'
                                                }
                                            `}
                                        >
                                            <div className='w-7 h-7 flex items-center justify-center rounded-full border border-muted-foreground text-muted-foreground'>{ i+1 }</div>
                                            <div>
                                                <div className='flex items-center gap-1'>
                                                    <p
                                                        className={
                                                            isSubOut( player.player._id ) 
                                                                ? 'line-through text-muted-foreground' 
                                                                : ''
                                                        }
                                                    >
                                                        { player.player.name }
                                                        { player.isCaptain && <span className='px-1 rounded-sm bg-yellow-500 font-bold text-black'>C</span> }
                                                    </p>
                                                    { isSubOut( player.player._id ) && <ArrowDown className='w-5 h-5 text-red-500' /> }
                                                </div>
                                                <span className='text-muted-foreground text-sm'>{ player.position }</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        
                        {/* Subs */}
                        <div>
                            <p className='text-sm'>Substitutes</p>
                            <div className='mt-2 space-y-2'>
                                {
                                    homeLineup.substitutes.map((player, i) => (
                                        <div 
                                            key={ player.player._id }
                                            className={`
                                                px-3 py-2 border rounded-lg flex items-center gap-2 ${
                                                    isSubIn( player.player._id ) 
                                                        ? 'border-green-500 bg-green-500/10'
                                                        : 'border-muted-foreground'
                                                }
                                            `}
                                        >
                                            <div className='w-7 h-7 flex items-center justify-center rounded-full border border-muted-foreground text-muted-foreground'>{ i+1 }</div>
                                            <div>
                                                <div className='flex items-center gap-1'>
                                                    <p>
                                                        { player.player.name }
                                                        { player.isCaptain && <span className='px-1 rounded-sm bg-yellow-500 font-bold text-black'>C</span> }
                                                    </p>
                                                    { isSubIn( player.player._id ) && <ArrowUp className='w-5 h-5 text-green-500' /> }
                                                </div>
                                                <span className='text-muted-foreground text-sm'>{ player.position }</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    
                    {/* Away */}
                    <div className='space-y-2'>
                        {/* Top Section */}
                        <div className='flex gap-2 items-center'>
                            <div className='w-8 h-8 flex items-center justify-center rounded-full border border-muted-foreground text-muted-foreground'>A</div>
                            <div>
                                <p>{ awayName }</p>
                                <span className='text-muted-foreground text-sm'>Formation: { awayLineup.formation }</span>
                            </div>
                        </div>

                        {/* Starting 11 */}
                        <div>
                            <p className='text-sm'>Starting XI</p>
                            <div className='mt-2 space-y-2'>
                                {
                                    awayLineup.startingXI.map((player, i) => (
                                        <div 
                                            key={ player.player._id }
                                            className={`
                                                px-3 py-2 border rounded-lg flex items-center gap-2 ${
                                                    isSubOut( player.player._id ) 
                                                        ? 'border-red-500 bg-red-500/10'
                                                        : 'border-muted-foreground'
                                                }
                                            `}
                                        >
                                            <div className='w-7 h-7 flex items-center justify-center rounded-full border border-muted-foreground text-muted-foreground'>{ i+1 }</div>
                                            <div>
                                                <div className='flex items-center gap-1'>
                                                    <p
                                                        className={
                                                            isSubOut( player.player._id ) 
                                                                ? 'line-through text-muted-foreground' 
                                                                : ''
                                                        }
                                                    >
                                                        { player.player.name }
                                                        { player.isCaptain && <span className='px-1 rounded-sm bg-yellow-500 font-bold text-black'>C</span> }
                                                    </p>
                                                    { isSubOut( player.player._id ) && <ArrowDown className='w-5 h-5 text-red-500' /> }
                                                </div>
                                                <span className='text-muted-foreground text-sm'>{ player.position }</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        
                        {/* Subs */}
                        <div>
                            <p className='text-sm'>Substitutes</p>
                            <div className='mt-2 space-y-2'>
                                {
                                    awayLineup.substitutes.map((player, i) => (
                                        <div 
                                            key={ player.player._id }
                                            className={`
                                                px-3 py-2 border rounded-lg flex items-center gap-2 ${
                                                    isSubIn( player.player._id ) 
                                                        ? 'border-green-500 bg-green-500/10'
                                                        : 'border-muted-foreground'
                                                }
                                            `}
                                        >
                                            <div className='w-7 h-7 flex items-center justify-center rounded-full border border-muted-foreground text-muted-foreground'>{ i+1 }</div>
                                            <div>
                                                <div className='flex items-center gap-1'>
                                                    <p>
                                                        { player.player.name }
                                                        { player.isCaptain && <span className='px-1 rounded-sm bg-yellow-500 font-bold text-black'>C</span> }
                                                    </p>
                                                    { isSubIn( player.player._id ) && <ArrowUp className='w-5 h-5 text-green-500' /> }
                                                </div>
                                                <span className='text-muted-foreground text-sm'>{ player.position }</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='md:col-span-6 px-4 py-4 bg-card border border-muted-foreground rounded-lg'>
                {/* Title */}
                <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
                    <ArrowUpDown className='w-5 h-5' />
                    Substitutions Made
                </h2>

                {/* Substitutions */}
                <div className='space-y-4 mt-4'>
                    {
                        substitutions.sort((a,b) => b.minute - a.minute).map(sub => (
                            <div
                                key={ sub.id } 
                                className='px-3 py-2 flex justify-between items-center border border-muted-foreground rounded-lg'
                            >
                                <div className='flex items-center gap-2 md:gap-4'>
                                    <span className='px-4 py-1 border border-muted-foreground bg-card text-sm rounded-full'>{ sub.minute }</span>
                                    <div className='flex gap-1 items-center font-bold text-green-500'>
                                        <ArrowUp className='w-5 h-5' />
                                        { sub.playerIn.name }
                                    </div>
                                    <p>|</p>
                                    <div className='flex gap-1 items-center font-bold text-red-500'>
                                        { sub.playerOut.name }
                                        <ArrowDown className='w-5 h-5' />
                                    </div>
                                </div>
                                <Trash2
                                    onClick={() => {}}
                                    className='text-red-500 w-5 h-5'
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default Lineups