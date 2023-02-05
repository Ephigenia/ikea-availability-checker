COLLECTION_FILENAME?=collections/IKEA_2be1a8ea-e4c0-44a5-ab3f-165c0d6f5f17.json
DATA_FILENAME?=test-data.json

# newman reporter: https://ravivamsi.github.io/postmanframework/
test:
	@npx newman@5.3.2 run $(COLLECTION_FILENAME) \
		--iteration-data $(DATA_FILENAME) \
		--ignore-redirects \
		--delay-request 500 \
		--timeout-request 1000 \
		--timeout 60000 \
		--reporters cli
