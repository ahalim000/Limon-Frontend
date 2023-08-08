import Header from "@/components/header/Header";
import AddEditRecipe from "@/components/addEditRecipe/AddEditRecipe";

export default function EditRecipe() {
    return (
        <>
            <Header></Header>
            <AddEditRecipe edit={true}></AddEditRecipe>
        </>
    );
}
