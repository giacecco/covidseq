# covidseq
Covidseq is a sequencer for [VCV Rack](https://vcvrack.com), written in memoriam of the deceased because of COVID-19 in the Netherlands.

The ```covidseq.js``` script is intended to be used as configuration for [VCV Rack's "Prototype" module](https://library.vcvrack.com/VCV-Prototype/Prototype). It generates a sequence of voltages centred around C4 (0V) that can used to feed an oscillator, a quantiser etc. to create melodies. As it runs, it displays the most recent number of total deaths and the municipalities they were recorded at.

The sequence is generated by running the ```prepare-data.js``` script and copying and pasting the resulting scriptlet in ```covidseq.js```. The data is fetched at the moment the script is executed, from the Dutch National Institute for Public Health and the Environment [here](https://data.rivm.nl/covid-19/). Every day the sequence will change, until there won't be any more deaths because of COVID-19.

```vcv-example-project.vcv``` is a sample VCV Rack project that uses ```covidseq.js```. Below is a video showing how it is used to play a random sequence of notes from C minor in Arturia Piano V2.

[![Watch the video](video.png)](https://youtu.be/TVsYDPLtMos)
