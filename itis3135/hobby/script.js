const buttons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.content');

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    buttons.forEach((btn) => btn.classList.remove('active'));
    sections.forEach((sec) => sec.classList.remove('active'));

    button.classList.add('active');
    const targetId = button.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});
