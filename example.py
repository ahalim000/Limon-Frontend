import requests

class RecipeService:
	BASE = "/api/recipes"

	def __init__(self, url):
		self.url = url
		self.token = token

	def _req(self, method, url, data=None):
		headers = {
			"Authorization": f"Bearer {self.token}"
		}
		resp = requests.request(method, self.BASE + url, data)
		return resp.json()

	def listRecipes(self):
		data = self._req("GET", "/")
		return data

	def getRecipe(self, id);
		data = self._req("PUT", f"/{id}")
		return dat

	def createRecipe(self, data):
		data = self._req("POST", "/", data=data)
		return data

	def updateRecipe(self, id, data);
		data = self._req("PUT", f"/{id}", data=data)
		return data
		

class RecipeClient:
	def __init__(self, url, token):
		self.url = url
		self.recipes = RecipeService(self, self.url, self.token)


if __name__ == "__main__":
	client = RecipeClient("http://localhost:8000", "ax2r....")
	recipes = client.recipes.listRecipes()
	print(recipes)


