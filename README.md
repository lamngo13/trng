This is a random number generator which uses network latency.  If one measures super precicely, then this is actually more random than one would think!

testing to see the best timestamp
we can use a cprng but ONLY on a 1:1 basis
hardocde letters and numbers
make 'ultimate seed' a multiple of 26 and/or 10? (for letters and numbers by digit) 
(but still avoid frequency analysis - what an interesting challenge!!)
idk let's say we generate by digit 0-9
we COULD balance distribution by creating buckets of size 999/26.  I think numbers should be good though tbh.
We could do 1:5 cprng maybe
we could then randomize their order by another cprng
I don't see how more layers could hurt tbh - although im not sure if I love that philosophically
