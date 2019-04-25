# My screeps AI

## Setup
Run `npm install` to get packages

Run `npm start` to compile

Push to master to release

## TODO
### Short term
```
Room stages from 5 to 8
```

### Long term:
```
Bank object should be cached at the start of each loop (for performance)
Then removed from the myRoom object at the end of the loop

Spawn a new miner before the old one dies, so no downtime.
to do this, have a nextMinerName on a MySource, swap it over when minerName is null
When the miner arrives at the cache pos, have a key called minerTravelTime (in ticks).
Set it every time.
In the spawning logic, just check if the tickstolive of the miner is <= minerTravelTime.
Problem is they'll just get later and later unless it measures it to 1 move AWAY from the cachePos...
```
