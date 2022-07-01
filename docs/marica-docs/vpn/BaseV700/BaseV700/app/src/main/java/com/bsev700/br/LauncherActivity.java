package com.bsev700.br;

import android.content.Intent;
import android.os.Bundle;

import com.bsev700.br.activities.BaseActivity;

/**
 * @author anuragdhunna
 */
public class LauncherActivity extends BaseActivity
{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_splash_screen);
		
		// inicia atividade principal
        Intent intent = new Intent(this, BASEV700MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
		startActivity(intent);
		
		// encerra o launcher
        finish();
    }
	
}
