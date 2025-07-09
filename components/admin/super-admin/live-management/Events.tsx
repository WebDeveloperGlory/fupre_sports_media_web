import React, { useState } from 'react'
import { LiveFixTimelineCreate } from '@/utils/V2Utils/formData';
import { FixtureLineup, FixtureTimeline } from '@/utils/V2Utils/v2requestSubData.types';
import { FixtureTimelineCardType, FixtureTimelineGoalType, FixtureTimelineType, TeamType } from '@/utils/V2Utils/v2requestData.enums';
import { Edit, List, Plus, Trash2 } from 'lucide-react';

const Events = (
  { events, currentTime, currentMinute, lineups }:
  { 
    events: FixtureTimeline[], 
    currentTime: Date, currentMinute: number, 
    lineups: { home: FixtureLineup, away: FixtureLineup } 
}
) => {
  const [currentEvents, setCurrentEvents] = useState<FixtureTimeline[]>( events );
  const [eventData, setEventData] = useState<LiveFixTimelineCreate>({
    event: {
      id: '',
      type: '' as FixtureTimelineType,
      team: '' as TeamType,
      player: '',
      minute: currentMinute,
      description: '',
    }
  });
  const [extraEventData, setExtraEventData] = useState({
    relatedPlayer: '',
    goalType: '' as FixtureTimelineGoalType,
    cardType: '' as FixtureTimelineCardType,
  })
  const [isInjuryTime, setIsInjuryTime] = useState<boolean>( false );

  const handleDeleteEvent = ( id: string ) => {

  }
  const handleEditEvent = ( id: string ) => {

  }
  const handleSubmitEvent = () => {

  }

  const sortedEvents = events.sort((a,b) => b.minute - a.minute);
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Add Events */}
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
          {/* Title */}
          <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
            <Plus className='w-5 h-5' />
            Add New Event
          </h2>

          {/* Form body */}
          <div className='space-y-4 mt-4'>
            <div className='grid grid-cols-2 gap-4'>
              {/* Event Type */}
              <div>
                <label className="block font-semibold mb-1.5">Event Type</label>
                <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ eventData.event.type }
                  onChange={ (e) => setEventData({
                    event: {
                      ...eventData.event,
                      type: e.target.value as FixtureTimelineType
                    }
                  }) }
                >
                  {
                    Object.values( FixtureTimelineType ).map( type => (
                      <option key={ type } value={ type } className='flex flex-col'>
                        { type }
                      </option>
                    ))
                  }
                </select>
              </div>
              {/* Team Select */}
              <div>
                <label className="block font-semibold mb-1.5">Select Team</label>
                <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ eventData.event.team }
                  onChange={ (e) => setEventData({
                    event: {
                      ...eventData.event,
                      team: e.target.value as TeamType
                    }
                  }) }
                >
                  {
                    Object.values( TeamType ).map( type => (
                      <option key={ type } value={ type } className='flex flex-col'>
                        { type }
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              {/* Player */}
              <div>
                <label className="block font-semibold mb-1.5">Select Player</label>
                <select 
                  className="w-full p-2 border rounded cursor-pointer bg-input"
                  value={ eventData.event.player }
                  onChange={ (e) => setEventData({
                    event: {
                      ...eventData.event,
                      player: e.target.value
                    }
                  }) }
                >
                  {
                    eventData.event.team === TeamType.HOME && [ ...lineups.home.startingXI, ...lineups.home.substitutes ].map( player => (
                      <option key={ player.player._id } value={ player.player._id } className='flex flex-col'>
                        { player.player.name }
                      </option>
                    ))
                  }
                  {
                    eventData.event.team === TeamType.AWAY && [ ...lineups.away.startingXI, ...lineups.away.substitutes ].map( player => (
                      <option key={ player.player._id } value={ player.player._id } className='flex flex-col'>
                        { player.player.name }
                      </option>
                    ))
                  }
                </select>
              </div>
              {/* Time */}
              <div>
                <label className="block font-semibold mb-1.5">Current Minute</label>
                <input
                    type='number'
                    placeholder='0'
                    min={0}
                    value={ eventData.event.minute }
                    onChange={
                      ( e ) => setEventData({
                        event: {
                          ...eventData.event,
                          minute: Number(e.target.value)
                        }
                    })
                  }
                  className='w-full p-2 border rounded bg-input'
                />
              </div>
            </div>
            {/* Description */}
            <div>
              <label className="block font-semibold mb-1.5">Description</label>
              <textarea 
                name="description" 
                placeholder='Enter event description'
                rows={4}
                className='w-full p-2 border rounded bg-input'
              >

              </textarea>
            </div>
            
            {/* Button */}
            <button
              onClick={ handleSubmitEvent }
              className='w-full text-center py-2 bg-emerald-500 hover:bg-emerald-500/50 rounded-lg flex items-center gap-2 justify-center'
            >
              <Plus className='w-5 h-5' />
              Add Event
            </button>
          </div>
        </div>

        {/* Current Events */}
        <div className='px-6 py-4 bg-card border border-muted-foreground rounded-lg my-4'>
          {/* Title */}
          <h2 className='text-lg font-bold flex gap-2 items-center text-emerald-500'>
            <List className='w-5 h-5' />
            Match Events
          </h2>

          {/* Events List */}
          <div className='space-y-4 mt-4 max-h-72 overflow-y-scroll'>
            {
              sortedEvents.map( event => (
                <div
                  key={event.id}
                  className='space-y-2 px-4 py-4 rounded-lg bg-card border border-muted-foreground'
                >
                  {/* Top Section */}
                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-1 text-sm'>
                      <p className='px-4 py-1 rounded-full border'>{ event.minute }</p>
                      <p className='px-4 py-1'>{ event.type }</p>
                      <span className='text-muted-foreground'>{ event.team === TeamType.HOME ? 'home' : 'away' }</span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <Edit
                        onClick={() => handleEditEvent( event.id )} 
                        className='w-4 h-4 cursor-pointer text-blue-500'
                      />
                      <Trash2
                        onClick={() => handleDeleteEvent( event.id )} 
                        className='w-4 h-4 cursor-pointer text-red-500'
                      />
                    </div>
                  </div>
                  {/* Middle Section */}
                  <div>
                    <p>{ event.player.name }</p>
                    <p className='text-muted-foreground'>{ event.description }</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Events