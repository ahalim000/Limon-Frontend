rm -rf src/recipe_client/
curl http://localhost:8000/openapi.json -o openapi.json
# https://fastapi.tiangolo.com/advanced/generate-clients/#preprocess-the-openapi-specification-for-the-client-generator
# generates openapi-fixed.json
./process_openapi.py
openapi -i openapi-fixed.json --name RecipeClient --output src/recipe_client --useOptions
