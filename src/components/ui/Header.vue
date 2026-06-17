<template>
  <header class="header-container">
    <div class="logo-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        />
      </svg>
      <span class="logo-text">HABIT FORGE</span>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #6200ea;
  border-bottom: 3px solid black;
  padding: 0 16px;
  box-sizing: border-box;
  font-family: var(--font-body);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}

.logo-text {
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: 0.05em;
  margin-top: 2px;
}
</style>
