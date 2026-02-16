package com.repik.lavagestion.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.repik.lavagestion.R
import com.repik.lavagestion.ui.theme.*

data class StatusStyle(val bg: Color, val text: Color, val labelRes: Int)

fun getStatusStyle(status: String): StatusStyle = when (status) {
    "RECEIVED" -> StatusStyle(StatusReceived, StatusReceivedText, R.string.status_received)
    "WASHING" -> StatusStyle(StatusWashing, StatusWashingText, R.string.status_washing)
    "READY" -> StatusStyle(StatusReady, StatusReadyText, R.string.status_ready)
    "DELIVERED" -> StatusStyle(StatusDelivered, StatusDeliveredText, R.string.status_delivered)
    else -> StatusStyle(Gray100, Gray500, R.string.status_received)
}

fun getNextStatus(current: String): String? = when (current) {
    "RECEIVED" -> "WASHING"
    "WASHING" -> "READY"
    "READY" -> "DELIVERED"
    else -> null
}

fun getNextStatusLabelRes(status: String): Int? = when (status) {
    "WASHING" -> R.string.status_washing
    "READY" -> R.string.status_ready
    "DELIVERED" -> R.string.status_delivered
    else -> null
}

@Composable
fun StatusBadge(status: String, modifier: Modifier = Modifier) {
    val style = getStatusStyle(status)
    Text(
        text = stringResource(style.labelRes),
        color = style.text,
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold,
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(style.bg)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    )
}
