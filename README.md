package com.yourpackage

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    lateinit var raceView: RaceView
    val handler = Handler(Looper.getMainLooper())
    val fps = 60L

    val gameLoop = object : Runnable {
        override fun run() {
            raceView.update()
            raceView.invalidate()
            handler.postDelayed(this, 1000L / fps)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        raceView = findViewById(R.id.raceView)

        findViewById<android.widget.Button>(R.id.btnLeft).setOnClickListener {
            raceView.moveLeft()
        }

        findViewById<android.widget.Button>(R.id.btnRight).setOnClickListener {
            raceView.moveRight()
        }

        handler.post(gameLoop)
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacksAndMessages(null)
    }
}
