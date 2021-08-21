<template>
   <main class="view-dashboard">
      <DashboardHeader />
      <Transactions />
   </main>
</template>

<route>
name: Dashboard
meta:
   requiresAuth: true
</route>
