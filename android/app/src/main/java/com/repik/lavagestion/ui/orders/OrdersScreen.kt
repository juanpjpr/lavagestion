package com.repik.lavagestion.ui.orders

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.repik.lavagestion.R
import com.repik.lavagestion.data.model.Order
import com.repik.lavagestion.ui.components.StatusBadge
import com.repik.lavagestion.ui.components.getNextStatus
import com.repik.lavagestion.ui.components.getNextStatusLabelRes

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    onNewOrder: () -> Unit,
    viewModel: OrdersViewModel = viewModel()
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current

    // Dialog state for WhatsApp notification prompt
    var showNotifyDialog by remember { mutableStateOf(false) }
    var pendingNotifyOrder by remember { mutableStateOf<Order?>(null) }

    // When advancing to READY, show notify dialog
    if (showNotifyDialog && pendingNotifyOrder != null) {
        val order = pendingNotifyOrder!!
        AlertDialog(
            onDismissRequest = {
                showNotifyDialog = false
                pendingNotifyOrder = null
            },
            title = { Text(stringResource(R.string.notify_title)) },
            text = {
                Text(stringResource(R.string.notify_message, order.client.name))
            },
            confirmButton = {
                Button(onClick = {
                    openWhatsApp(context, order.client.phone, context.getString(R.string.notify_whatsapp_text, order.ticketNumber.toString()))
                    showNotifyDialog = false
                    pendingNotifyOrder = null
                }) {
                    Text(stringResource(R.string.notify_yes))
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showNotifyDialog = false
                    pendingNotifyOrder = null
                }) {
                    Text(stringResource(R.string.notify_no))
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(stringResource(R.string.orders_title)) },
                actions = {
                    IconButton(onClick = onNewOrder) {
                        Icon(Icons.Default.Add, contentDescription = stringResource(R.string.orders_new))
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onNewOrder) {
                Icon(Icons.Default.Add, contentDescription = stringResource(R.string.orders_new))
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            // Filter chips
            FilterChips(
                selected = state.selectedFilter,
                onSelect = { viewModel.loadOrders(it) }
            )

            if (state.isLoading) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator()
                }
            } else if (state.orders.isEmpty()) {
                Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(stringResource(R.string.orders_empty), color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(state.orders, key = { it.id }) { order ->
                        OrderCard(
                            order = order,
                            onAdvanceStatus = { orderId, newStatus ->
                                // If advancing to READY, show notify dialog after updating
                                if (newStatus == "READY") {
                                    pendingNotifyOrder = order
                                    viewModel.updateStatus(orderId, newStatus)
                                    showNotifyDialog = true
                                } else {
                                    viewModel.updateStatus(orderId, newStatus)
                                }
                            },
                            onNotifyClient = { ord ->
                                openWhatsApp(context, ord.client.phone, context.getString(R.string.notify_whatsapp_text, ord.ticketNumber.toString()))
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun FilterChips(selected: String?, onSelect: (String?) -> Unit) {
    val filters = listOf(
        null to stringResource(R.string.filter_all),
        "RECEIVED" to stringResource(R.string.filter_received),
        "WASHING" to stringResource(R.string.filter_washing),
        "READY" to stringResource(R.string.filter_ready),
        "DELIVERED" to stringResource(R.string.filter_delivered)
    )

    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(filters) { (status, label) ->
            FilterChip(
                selected = selected == status,
                onClick = { onSelect(status) },
                label = { Text(label) }
            )
        }
    }
}

@Composable
private fun OrderCard(
    order: Order,
    onAdvanceStatus: (String, String) -> Unit,
    onNotifyClient: (Order) -> Unit
) {
    val nextStatus = getNextStatus(order.status)
    val nextLabelRes = nextStatus?.let { getNextStatusLabelRes(it) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: ticket + status
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "#${order.ticketNumber}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                StatusBadge(order.status)
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Client info
            Text(
                text = order.client.name,
                fontWeight = FontWeight.Medium,
                fontSize = 15.sp
            )
            Text(
                text = order.client.phone,
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Items summary + price
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = stringResource(R.string.orders_items, order.items.size),
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = "$${String.format("%,.0f", order.totalPrice)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }

            // Advance status button
            if (nextStatus != null && nextLabelRes != null) {
                val nextLabel = stringResource(nextLabelRes)
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = { onAdvanceStatus(order.id, nextStatus) },
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(vertical = 8.dp)
                ) {
                    Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(stringResource(R.string.orders_advance_to, nextLabel))
                }
            }

            // Notify button for READY orders
            if (order.status == "READY") {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedButton(
                    onClick = { onNotifyClient(order) },
                    modifier = Modifier.fillMaxWidth(),
                    contentPadding = PaddingValues(vertical = 8.dp)
                ) {
                    Text(stringResource(R.string.notify_btn))
                }
            }
        }
    }
}

private fun openWhatsApp(context: Context, phone: String, message: String) {
    val cleanPhone = phone.replace(Regex("[^0-9+]"), "")
    val url = "https://wa.me/$cleanPhone?text=${Uri.encode(message)}"
    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
    context.startActivity(intent)
}
