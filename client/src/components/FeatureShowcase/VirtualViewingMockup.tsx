import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Maximize2, Volume2, Eye, Clock, Share2 } from "lucide-react";
import { useState } from "react";

export function VirtualViewingMockup() {
  const shouldReduceMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);

  const tourStats = [
    { label: "Total Views", value: "342", icon: Eye },
    { label: "Avg. Watch Time", value: "2m 45s", icon: Clock },
    { label: "Completion Rate", value: "78%", icon: Play },
  ];

  const videoTours = [
    {
      id: 1,
      title: "Premium Studio Tour",
      type: "360° Virtual Tour",
      duration: "3:24",
      views: 156,
      thumbnail: "bg-gradient-to-br from-blue-500 to-purple-500",
    },
    {
      id: 2,
      title: "Ensuite Room Walkthrough",
      type: "Video Tour",
      duration: "2:18",
      views: 98,
      thumbnail: "bg-gradient-to-br from-green-500 to-teal-500",
    },
    {
      id: 3,
      title: "Common Areas & Facilities",
      type: "Video Tour",
      duration: "4:12",
      views: 88,
      thumbnail: "bg-gradient-to-br from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-6" data-testid="mockup-virtual-viewing">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold">Virtual Viewing Platform</h3>
        <p className="text-sm text-muted-foreground mt-1">24/7 self-guided property tours with analytics</p>
      </div>

      {/* Main Video Player */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Premium Studio - Virtual Tour</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" data-testid="badge-tour-type">360° Interactive</Badge>
              <Badge variant="outline">YouTube Hosted</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Video Player Interface */}
          <div className="relative aspect-video bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-lg overflow-hidden group">
            {/* Fake Video Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0.3 }}
                animate={shouldReduceMotion ? { opacity: 0.5 } : { opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: shouldReduceMotion ? 0 : 3, repeat: shouldReduceMotion ? 0 : Infinity }}
                className="text-white text-center"
              >
                <Building2Icon className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold">Premium Studio Tour</p>
                <p className="text-sm opacity-80">High-quality 4K walkthrough</p>
              </motion.div>
            </div>

            {/* Play Button Overlay */}
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
              data-testid="button-play-video"
            >
              <div className="h-20 w-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-2xl">
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-primary ml-0" />
                ) : (
                  <Play className="h-10 w-10 text-primary ml-1" />
                )}
              </div>
            </motion.button>

            {/* Video Controls */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" data-testid="button-play-pause">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isPlaying ? "100%" : "40%" }}
                    transition={{ duration: isPlaying ? 204 : 0 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <span className="text-white text-sm font-mono">1:32 / 3:24</span>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" data-testid="button-volume">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" data-testid="button-fullscreen">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Viewer Count Badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/60 backdrop-blur text-white border-white/20">
                <Eye className="h-3 w-3 mr-1" />
                156 views
              </Badge>
            </div>
          </div>

          {/* Tour Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {tourStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
                className="text-center p-3 rounded-lg bg-muted/50"
                data-testid={`stat-${index}`}
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Tours */}
      <div>
        <h4 className="font-semibold mb-3">More Virtual Tours</h4>
        <div className="grid gap-4 md:grid-cols-3">
          {videoTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3, delay: shouldReduceMotion ? 0 : index * 0.1 }}
            >
              <Card className="hover-elevate cursor-pointer group" data-testid={`tour-card-${tour.id}`}>
                <CardContent className="p-0">
                  <div className={`relative aspect-video ${tour.thumbnail} rounded-t-lg overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary ml-1" />
                      </div>
                    </div>
                    <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white border-white/20 text-xs">
                      {tour.duration}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h5 className="font-semibold text-sm mb-1">{tour.title}</h5>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{tour.type}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {tour.views}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share Options */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Share Virtual Tours</p>
              <p className="text-xs text-muted-foreground">Send self-guided tour links to prospects</p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-share-tour">
              <Share2 className="h-4 w-4 mr-2" />
              Get Share Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
