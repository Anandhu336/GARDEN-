MUSIC USED BY THE GARDEN

gymnopedie-1.m4a  - Erik Satie, Gymnopedie No. 1, classical guitar arrangement performed by Michael Laucke.
gymnopedie-2.m4a  - Erik Satie, Gymnopedie No. 2, classical guitar arrangement performed by Michael Laucke.

Source: Wikimedia Commons, "Satie Gymnopedie No 1 / No 2 performed by Michael Laucke" (FLAC).
Licence shown on Commons: Public domain (released by the performer, uploader "Mlaucke").
Converted to AAC (.m4a, 96 kbps) so they are small and play on iPhones as well as Android and computers.

TO ADD YOUR OWN BUILT-IN SONG
1. Put an .m4a or .mp3 file in this folder (about 2-4 MB is ideal; use music you are allowed to publish).
2. Open js/music.js, find the KS.TRACKS list near the top, and add a line:
     { id: 'mysong', name: 'My song', mood: 'Upbeat', file: 'music/my-song.m4a', credit: 'Who made it' },
   The id must be short with no spaces. It is stored in published pages, so never change it later.
3. Upload js/music.js and the music folder to GitHub again.

(Visitors can also pick "My own song" or a YouTube link in the editor without any of this.)
