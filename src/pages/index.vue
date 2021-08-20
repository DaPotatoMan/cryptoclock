<template>
   <main class="view-dashboard">
      <DashboardHeader />
      <TransactionList />
   </main>
</template>

<route>
name: Dashboard
meta:
   requiresAuth: true
</route>
