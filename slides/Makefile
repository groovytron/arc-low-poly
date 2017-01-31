reveal.js:
	git clone https://github.com/hakimel/reveal.js.git

.PHONY: slides
slides: reveal.js slides.md
	pandoc -s -S -t revealjs slides.md -o slides.html \
		--self-contained \
		--variable theme="beige" \
		--variable transition="slide"
