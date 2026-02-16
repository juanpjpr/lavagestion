package com.repik.lavagestion.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.repik.lavagestion.R
import com.repik.lavagestion.ui.login.LoginViewModel
import com.repik.lavagestion.ui.neworder.NewOrderScreen
import com.repik.lavagestion.ui.orders.OrdersScreen
import com.repik.lavagestion.ui.reports.ReportsScreen
import com.repik.lavagestion.ui.settings.SettingsScreen
import kotlinx.serialization.Serializable

// Route definitions
@Serializable object OrdersRoute
@Serializable object NewOrderRoute
@Serializable object ReportsRoute
@Serializable object SettingsRoute

data class BottomNavItem(
    val labelRes: Int,
    val icon: ImageVector,
    val route: Any
)

@Composable
fun MainApp(loginViewModel: LoginViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    val bottomNavItems = listOf(
        BottomNavItem(R.string.nav_orders, Icons.Default.Receipt, OrdersRoute),
        BottomNavItem(R.string.nav_reports, Icons.Default.BarChart, ReportsRoute),
        BottomNavItem(R.string.nav_settings, Icons.Default.Settings, SettingsRoute)
    )

    // Only show bottom bar on main screens (not on NewOrder)
    val showBottomBar = currentDestination?.let { dest ->
        bottomNavItems.any { dest.hasRoute(it.route::class) }
    } ?: true

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                NavigationBar {
                    bottomNavItems.forEach { item ->
                        val label = stringResource(item.labelRes)
                        NavigationBarItem(
                            selected = currentDestination?.hasRoute(item.route::class) == true,
                            onClick = {
                                navController.navigate(item.route) {
                                    popUpTo(OrdersRoute) { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            },
                            icon = { Icon(item.icon, contentDescription = label) },
                            label = { Text(label) }
                        )
                    }
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = OrdersRoute,
            modifier = Modifier.padding(padding)
        ) {
            composable<OrdersRoute> {
                OrdersScreen(onNewOrder = { navController.navigate(NewOrderRoute) })
            }
            composable<NewOrderRoute> {
                NewOrderScreen(onBack = { navController.popBackStack() })
            }
            composable<ReportsRoute> {
                ReportsScreen()
            }
            composable<SettingsRoute> {
                SettingsScreen(onLogout = { loginViewModel.logout() })
            }
        }
    }
}
