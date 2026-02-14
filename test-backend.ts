
import { login, logout, checkAuth } from './app/actions/auth';
import { getMotorbikes, addMotorbike, updateMotorbike, deleteMotorbike } from './app/actions/motorbikes';
import { getCategories, addCategory, deleteCategory } from './app/actions/categories';
import { getSettings } from './app/actions/settings';

async function testBackend() {
    console.log('--- Testing Auth ---');
    const loginRes = await login('admin123'); // Correct password
    console.log('Login (correct):', loginRes.success ? 'PASS' : 'FAIL');

    const loginFail = await login('wrongpass');
    console.log('Login (wrong):', !loginFail.success ? 'PASS' : 'FAIL');

    console.log('\n--- Testing Categories ---');
    const initialCats = await getCategories();
    console.log('Initial Categories:', initialCats.length);

    await addCategory('Test Category');
    const afterAddCats = await getCategories();
    console.log('Add Category:', afterAddCats.length > initialCats.length ? 'PASS' : 'FAIL');

    const newCat = afterAddCats.find(c => c.name === 'Test Category');
    if (newCat) {
        await deleteCategory(newCat.id);
        const afterDeleteCats = await getCategories();
        console.log('Delete Category:', afterDeleteCats.length === initialCats.length ? 'PASS' : 'FAIL');
    }

    console.log('\n--- Testing Motorbikes ---');
    const initialMotors = await getMotorbikes();
    console.log('Initial Motorbikes:', initialMotors.length);

    // Note: timestamps are handled by DB default or server action
    // image_urls is expected to be string[] in the action input
    const newMotorData = {
        name: 'Test Motor',
        price: 15000000,
        category: 'Matic',
        year: 2020,
        location: 'Test Loc',
        imageUrls: ['http://example.com/image.jpg']
    };

    await addMotorbike(newMotorData);
    const afterAddMotors = await getMotorbikes();
    console.log('Add Motorbike:', afterAddMotors.length > initialMotors.length ? 'PASS' : 'FAIL');

    const addedMotor = afterAddMotors.find(m => m.name === 'Test Motor');
    if (addedMotor) {
        await updateMotorbike(addedMotor.id, { price: 16000000 });
        const updatedMotors = await getMotorbikes();
        const updated = updatedMotors.find(m => m.id === addedMotor.id);
        console.log('Update Motorbike:', updated?.price === 16000000 ? 'PASS' : 'FAIL');

        await deleteMotorbike(addedMotor.id);
        const finalMotors = await getMotorbikes();
        console.log('Delete Motorbike:', finalMotors.length === initialMotors.length ? 'PASS' : 'FAIL');
    }

    console.log('\n--- Testing Settings ---');
    const settings = await getSettings();
    console.log('Get Settings:', settings.storeName ? 'PASS' : 'FAIL');
}

testBackend().catch(console.error);
