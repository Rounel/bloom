'use client'

import { useState } from 'react'
import { tvPrograms, type TVProgram } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { 
  Play, 
  Radio, 
  Clock, 
  Calendar, 
  Volume2, 
  VolumeX,
  Maximize2,
  SkipForward,
  List
} from 'lucide-react'

export function WebTVPanel() {
  const [selectedProgram, setSelectedProgram] = useState<TVProgram>(tvPrograms[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(true)

  const liveProgram = tvPrograms.find(p => p.isLive)
  const upcomingPrograms = tvPrograms.filter(p => !p.isLive)

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Video Player Area */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {/* Placeholder for video */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-background">
          {selectedProgram.isLive ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Radio className="w-5 h-5 text-destructive animate-pulse" />
                <span className="text-xs font-semibold text-destructive uppercase tracking-wider">En direct</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{selectedProgram.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{selectedProgram.description}</p>
            </div>
          ) : (
            <div className="text-center">
              <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-foreground">{selectedProgram.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Programmé à {selectedProgram.scheduledTime}
              </p>
            </div>
          )}
        </div>

        {/* Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-primary-foreground ml-1" />
            </div>
          </button>
        )}

        {/* Live Badge */}
        {selectedProgram.isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-destructive rounded text-destructive-foreground text-xs font-semibold">
            <Radio className="w-3 h-3 animate-pulse" />
            LIVE
          </div>
        )}

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded hover:bg-white/20 transition-colors"
              >
                <Play className={cn("w-4 h-4 text-white", isPlaying && "hidden")} />
              </button>
              <button className="p-1.5 rounded hover:bg-white/20 transition-colors">
                <SkipForward className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded hover:bg-white/20 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={cn(
                  "p-1.5 rounded hover:bg-white/20 transition-colors",
                  showPlaylist && "bg-white/20"
                )}
              >
                <List className="w-4 h-4 text-white" />
              </button>
              <button className="p-1.5 rounded hover:bg-white/20 transition-colors">
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Program Info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h4 className="text-sm font-medium text-foreground">{selectedProgram.title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedProgram.duration}
            </span>
            <span className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">
              {selectedProgram.category}
            </span>
          </div>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && (
        <div className="flex-1 overflow-auto space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1 mb-1">
            Programme
          </div>
          {tvPrograms.map((program) => (
            <button
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors",
                selectedProgram.id === program.id 
                  ? "bg-primary/10 border border-primary/30" 
                  : "hover:bg-secondary/50"
              )}
            >
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                {program.isLive ? (
                  <Radio className="w-4 h-4 text-destructive" />
                ) : (
                  <Play className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground truncate">{program.title}</div>
                <div className="text-[10px] text-muted-foreground">
                  {program.isLive ? 'En cours' : program.scheduledTime}
                </div>
              </div>
              {program.isLive && (
                <span className="px-1.5 py-0.5 bg-destructive text-destructive-foreground text-[10px] rounded">
                  LIVE
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
