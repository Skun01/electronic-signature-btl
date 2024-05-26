

//Thuat toan tao khoa

//Lay lua chon cua nguoi dung:



//// NGUOI DUNG NHAP MODE:

































const createKeyTool = document.querySelector('.create-key-section .btn');
const createKeySection = document.querySelector('.form-1');

const createSignatureTool = document.querySelector('.create-signature .btn');
const createSignatureSection = document.querySelector('.signature');

const verifyingTool = document.querySelector('.verifying-signature .btn')
const verifyingSection = document.querySelector('.verifying');

createKeyTool.addEventListener('click', e=>{
    createKeyTool.classList.add('btn-active');
    createSignatureTool.classList.remove('btn-active');
    verifyingTool.classList.remove('btn-active');

    createKeySection.style.display = "block";
    createSignatureSection.style.display = 'none';
    verifyingSection.style.display = 'none';
});

createSignatureTool.addEventListener('click', e=>{
    createKeyTool.classList.remove('btn-active');
    createSignatureTool.classList.add('btn-active');
    verifyingTool.classList.remove('btn-active');

    createKeySection.style.display = "none";
    createSignatureSection.style.display = 'block';
    verifyingSection.style.display = 'none';
});

verifyingTool.addEventListener('click', e=>{
    createKeyTool.classList.remove('btn-active');
    createSignatureTool.classList.remove('btn-active');
    verifyingTool.classList.add('btn-active');

    createKeySection.style.display = "none";
    createSignatureSection.style.display = 'none';
    verifyingSection.style.display = 'block';
});