import EditProductForm from "./edit-product-form";

export const dynamic = 'force-dynamic';

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <EditProductForm productId={params.id} />;
}
